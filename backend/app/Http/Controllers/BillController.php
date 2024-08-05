<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class BillController extends Controller
{
    //
    public function searchRoom(Request $request, $id)
    {
        Log::info('Dữ liệu yêu cầu:', ['quantity' => $request->quantity, 'capacity' => $request->people]);
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
            ->where('hotels.id', '=', $id)
            ->where('rooms.status', '=', 1)
            ->where('rooms.quantity', '>=', intval($request->quantity))
            ->where('rooms.capacity', '>=', intval($request->people))
            ->get();

        return response()->json($hotel);
    }

    public function searchMainRoom(Request $request)
    {
        Log::info('Dữ liệu yêu cầu:', ['quantity' => $request->quantity, 'capacity' => $request->people, 'search' => $request->search]);
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
                'rooms.capacity'
            )
            ->where('hotels.name', 'like', '%' . $request->search . '%')
            ->where('rooms.status', '=', 1)
            ->where('rooms.quantity', '>=', intval($request->quantity))
            ->where('rooms.capacity', '>=', intval($request->people))
            ->get();

        return response()->json($hotel);
    }

    public function price(): JsonResponse
    {
        $maxValue = DB::table('rooms')
            ->where('status', '=', '1')
            ->max('price');
        return response()->json($maxValue);
    }

    public function updateStatus()
    {
        $rooms = DB::table('rooms')->where('count', '=', 0)->get();
        $roomStatus = DB::table('rooms')->where('status', '=', 0)->get();
        if (isset($rooms)) {
            DB::table('rooms')->where('count', '=', 0)->update([
                'status' => 0,
            ]);
        }
        if (isset($roomStatus)) {
            DB::table('rooms')->where('count', '>', 0)->update([
                'status' => 1,
            ]);
        }
    }

    public function viewBillByUserId($id)
    {
        $bills = DB::table('bills')
            ->leftJoin('bill_detaills', 'bill_detaills.bill_id', '=', 'bills.id')
            ->leftJoin('cart', 'cart.id', '=', 'bill_detaills.cart_id')
            ->leftJoin('room_types', 'room_types.id', '=', 'cart.room_type_id')
            ->leftJoin('hotels', 'hotels.id', '=', 'cart.hotel_id')
            ->select(
                'bills.total',
                'bills.id as billId',
                'cart.getIn',
                'cart.getOut',
                'bills.status',
                'cart.quantity',
                'cart.capacity',
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.phone',
                'room_types.name as roomTypeName'
            )
            ->groupBy(
                'bills.total',
                'bills.id',
                'cart.getIn',
                'cart.getOut',
                'bills.status',
                'cart.quantity',
                'cart.capacity',
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.phone',
                'room_types.name'
            )
            ->where('bills.user_id', $id)
            ->get();
        return response()->json($bills);
    }

    public function viewBill()
    {
        $bills = DB::table('bills')
            ->leftJoin('bill_detaills', 'bill_detaills.bill_id', '=', 'bills.id')
            ->leftJoin('cart', 'cart.id', '=', 'bill_detaills.cart_id')
            ->leftJoin('room_types', 'room_types.id', '=', 'cart.room_type_id')
            ->leftJoin('hotels', 'hotels.id', '=', 'cart.hotel_id')
            ->select(
                'bills.total',
                'bills.id',
                'bills.user_id as userId',
                'bills.name as userName',
                'cart.getIn',
                'cart.getOut',
                'bills.status',
                'cart.quantity',
                'cart.capacity',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.phone',
                'room_types.name as roomTypeName'
            )
            ->groupBy(
                'bills.total',
                'bills.id',
                'bills.user_id',
                'bills.name',
                'cart.getIn',
                'cart.getOut',
                'bills.status',
                'cart.quantity',
                'cart.capacity',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.phone',
                'room_types.name'
            )
            ->get();
        return response()->json($bills);
    }
    public function updateBill($id, Request $request)
    {
        DB::table('bills')
            ->where('bills.id', '=', $id)
            ->update([
                'status' => $request[0]
            ]);
    }
    public function updateDay()
    {
        $rooms = DB::table('cart')->where('status', 0)->get();
        $now = Carbon::now()->format('Y-m-d');

        // Khởi tạo mảng để lưu tổng số lượng phòng cần cập nhật cho từng cặp hotel_id và room_type_id
        $roomUpdates = [];

        DB::beginTransaction();
        try {
            foreach ($rooms as $room) {
                if ($room->getOut == $now) {
                    $key = $room->hotel_id . '_' . $room->room_type_id;
                    if (!isset($roomUpdates[$key])) {
                        $roomUpdates[$key] = 0;
                    }
                    $roomUpdates[$key] += $room->quantity;
                }
            }

            // Thực hiện cập nhật số lượng phòng cho từng cặp hotel_id và room_type_id
            foreach ($roomUpdates as $key => $quantity) {
                list($hotel_id, $room_type_id) = explode('_', $key);

                $countRoom = DB::table('rooms')
                    ->where('hotel_id', $hotel_id)
                    ->where('room_type_id', $room_type_id)
                    ->first();

                if ($countRoom) {
                    DB::table('rooms')
                        ->where('hotel_id', $hotel_id)
                        ->where('room_type_id', $room_type_id)
                        ->update([
                            'count' => $countRoom->count + $quantity,
                        ]);

                    DB::table('cart')
                        ->where('hotel_id', $hotel_id)
                        ->where('room_type_id', $room_type_id)
                        ->where('getOut', $now)
                        ->where('status', 0)
                        ->update(['status' => 2]);
                }
            }
            DB::table('cart')
                ->where('getIn', '<', $now)
                ->where('status', 1)
                ->update(['status' => 3]);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 400);
        }

        return response()->json(['message' => 'Cập nhật thành công'], 200);
    }

    public function comment(Request $request)
    {
        DB::table('comments')->insert([
            'msg' => $request->comment,
            'hotel_id' => $request->hotelId,
            'user_id' => $request->userId,
        ]);
        DB::table('bills')->where('id', $request->billId)->update([
            'status' => 3,
        ]);
    }

    public function commentByHotel($id)
    {
        $comments = DB::table('comments')->leftJoin('users', 'users.id', '=', 'comments.user_id')->where('hotel_id', $id)->get();
        return response()->json($comments);
    }

    public function filter(Request $request)
    {
        $roomTypes = explode(',', $request->options);
        $hotels = [];
        foreach ($roomTypes as $roomType) {
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
                    'rooms.capacity'
                )
                ->where('rooms.price', '<=', $request->price)
                ->where('rooms.room_type_id', '=', $roomType)
                ->get();
            $hotels = array_merge($hotels, $hotel->toArray());
        }
        return response()->json($hotels);
    }

    
}
