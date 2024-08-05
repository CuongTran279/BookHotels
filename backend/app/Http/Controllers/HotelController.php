<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    //
    public function add(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate ảnh
            'options' => 'required|string' // Đảm bảo options được truyền vào
        ]);

        DB::beginTransaction();

        try {
            $imagePath = $request->file('image')->store('images', 'public');

            $hotelId = DB::table('hotels')->insertGetId([
                'name' => $request->name,
                'image' => $imagePath,
                'description' => $request->description,
                'address' => $request->address,
                'phone' => $request->phone,
                'city' => $request->city,
            ]);

            $roomTypes = explode(',', $request->options);

            foreach ($roomTypes as $roomType) {
                $fetchRoomType = DB::table('room_types')->where('id', $roomType)->first();

                if (!$fetchRoomType) {
                    throw new \Exception("Room type ID $roomType không tồn tại.");
                }

                DB::table('rooms')->insert([
                    'hotel_id' => $hotelId,
                    'room_type_id' => $roomType,
                    'price' => $fetchRoomType->price,
                    'capacity' => $fetchRoomType->capacity,
                    'count' => $fetchRoomType->capacity
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Thêm mới thành công'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 400);
        }
    }

    public function view()
    {
        $hotel = DB::table('hotels')
            ->leftJoin('rooms', 'rooms.hotel_id', '=', 'hotels.id')
            ->leftJoin('room_types', 'room_types.id', '=', 'rooms.room_type_id')
            ->leftJoin('images', 'images.room_type_id', '=', 'room_types.id')
            ->select(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.status',
                'room_types.name as roomTypeName',
                'room_types.description as roomTypeDescription',
                'rooms.price as roomTypePrice',
                'rooms.count as roomTypeCapacity',
                'room_types.id as roomTypeId',
                DB::raw("GROUP_CONCAT(images.path SEPARATOR '|') AS roomTypeImage")
            )
            ->groupBy(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name',
                'room_types.id',
                'room_types.description',
                'rooms.price',
                'rooms.capacity',
            )
            ->get();

        return response()->json($hotel);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            // Xóa các hình ảnh liên quan trước
            $image = DB::table('hotels')->where('id', $id)->first();
            Storage::disk('public')->delete($image->image);

            // Xóa hotel
            DB::table('hotels')->where('id', $id)->delete();
            // Xóa room
            DB::table('rooms')->where('hotel_id', $id)->delete();

            DB::commit();
            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
    public function viewById($id)
    {
        DB::table('hotels')
        ->where('id', $id)
        ->increment('views');
        $hotel = DB::table('hotels')
            ->leftJoin('rooms', 'rooms.hotel_id', '=', 'hotels.id')
            ->leftJoin('room_types', 'room_types.id', '=', 'rooms.room_type_id')
            ->leftJoin('images', 'images.room_type_id', '=', 'room_types.id')
            ->select(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name as roomTypeName',
                'room_types.description as roomTypeDescription',
                'rooms.price as roomTypePrice',
                'rooms.capacity as roomTypeCapacity',
                'room_types.id as roomTypeId',
                DB::raw("GROUP_CONCAT(images.path SEPARATOR '|') AS roomTypeImage")
            )
            ->groupBy(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name',
                'room_types.id',
                'room_types.description',
                'rooms.price',
                'rooms.capacity',
            )
            ->where('hotels.id', $id)
            ->get();

        return response()->json($hotel);
    }

    public function update($id, Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'rooms' => 'required|json', // Validate that rooms is a JSON string
        ]);

        DB::beginTransaction();
        try {
            // Update hotel
            $hotelData = [
                'name' => $request->name,
                'description' => $request->description,
                'address' => $request->address,
                'phone' => $request->phone,
                'city' => $request->city,
            ];

            if ($request->file('image')) {
                // Xóa ảnh cũ nếu có
                $image = DB::table('hotels')->where('id', $id)->first();
                if ($image && $image->image) {
                    Storage::disk('public')->delete($image->image);
                }

                // Lưu ảnh mới
                $imagePath = $request->file('image')->store('images', 'public');
                $hotelData['image'] = $imagePath;
            }

            DB::table('hotels')->where('id', $id)->update($hotelData);

            // Cập nhật thông tin các loại phòng
            $rooms = json_decode($request->rooms, true);

            // Kiểm tra cấu trúc dữ liệu rooms
            if (is_array($rooms)) {
                foreach ($rooms as $room) {
                    if (isset($room['room_type_id'])) {
                        DB::table('rooms')->where('hotel_id', $id)
                            ->where('room_type_id', $room['room_type_id'])
                            ->update([
                                'price' => $room['price'],
                                'quantity' => $room['quantity'],
                                'capacity' => $room['capacity'],
                                'count' => $room['quantity'],
                            ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Sửa thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function viewByCity($id)
    {
        $hotel = DB::table('hotels')->where('id', $id)->first();
        $city = $hotel->city;
        $hotelsByCity = DB::table('hotels')
            ->leftJoin('rooms', 'rooms.hotel_id', '=', 'hotels.id')
            ->leftJoin('room_types', 'room_types.id', '=', 'rooms.room_type_id')
            ->leftJoin('images', 'images.room_type_id', '=', 'room_types.id')
            ->select(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name as roomTypeName',
                'room_types.description as roomTypeDescription',
                'rooms.price as roomTypePrice',
                'rooms.capacity as roomTypeCapacity',
                'room_types.id as roomTypeId',
                DB::raw("GROUP_CONCAT(images.path SEPARATOR '|') AS roomTypeImage")
            )
            ->groupBy(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name',
                'room_types.id',
                'room_types.description',
                'rooms.price',
                'rooms.capacity'
            )
            ->where('hotels.city', 'like', '%' . $city . '%')
            ->get();

        // Trả về kết quả (có thể là view, JSON hoặc bất kỳ định dạng nào bạn mong muốn)
        return response()->json($hotelsByCity);
    }

    public function viewHotelByCity($id){
        $city = DB::table('cities')->where('id',$id)->first();
        $cityName = $city->name;
        $hotelsByCity = DB::table('hotels')
            ->leftJoin('rooms', 'rooms.hotel_id', '=', 'hotels.id')
            ->leftJoin('room_types', 'room_types.id', '=', 'rooms.room_type_id')
            ->leftJoin('images', 'images.room_type_id', '=', 'room_types.id')
            ->select(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name as roomTypeName',
                'room_types.description as roomTypeDescription',
                'rooms.price as roomTypePrice',
                'rooms.capacity as roomTypeCapacity',
                'room_types.id as roomTypeId',
                DB::raw("GROUP_CONCAT(images.path SEPARATOR '|') AS roomTypeImage")
            )
            ->groupBy(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'rooms.count',
                'rooms.status',
                'room_types.name',
                'room_types.id',
                'room_types.description',
                'rooms.price',
                'rooms.capacity'
            )
            ->where('hotels.city', 'like', '%' . $cityName . '%')
            ->get();

        return response()->json($hotelsByCity);
    }
}
