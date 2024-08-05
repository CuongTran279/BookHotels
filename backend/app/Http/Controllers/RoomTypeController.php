<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    //
    public function add(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'capacity' => 'required|integer|max:255',
            'images' => 'required|array',
            'images.*' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        DB::beginTransaction();
        try {
            $roomTypeId = DB::table('room_types')->insertGetId([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'capacity' => $request->capacity,
            ]);
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public'); // 'public' disk
                DB::table('images')->insert([
                    'path' => $path,
                    'room_type_id' => $roomTypeId,
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'Thêm mới thành công'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function view()
    {
        $roomTypes = DB::table('room_types')
            ->leftJoin('images', 'room_types.id', '=', 'images.room_type_id')
            ->select(
                'room_types.id',
                'room_types.name',
                'room_types.description',
                'room_types.price',
                'room_types.capacity',
                'images.path as image_path'
            )
            ->get()
            ->groupBy('id');

        $formattedData = $roomTypes->map(function ($items) {
            // Create a new room type object from the first item
            $roomType = $items->first();
            // Collect all image paths for this room type
            $roomType->images = $items->pluck('image_path')->toArray();
            return $roomType;
        });

        return response()->json($formattedData->values()); // Use values() to get a non-associative array
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            // Xóa các hình ảnh liên quan trước
            $images = DB::table('images')->where('room_type_id', $id)->get();
            foreach ($images as $image) {
                Storage::disk('public')->delete($image->path);
            }
            DB::table('images')->where('room_type_id', $id)->delete();

            // Xóa loại phòng
            DB::table('room_types')->where('id', $id)->delete();

            DB::commit();
            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function viewById($id)
    {
        $roomTypes = DB::table('room_types')
            ->leftJoin('images', 'room_types.id', '=', 'images.room_type_id')
            ->select(
                'room_types.id',
                'room_types.name',
                'room_types.description',
                'room_types.price',
                'room_types.capacity',
                'images.path as image_path'
            )
            ->where('room_types.id', $id)
            ->get()
            ->groupBy('id');

        $formattedData = $roomTypes->map(function ($items) {
            $roomType = $items->first();
            $roomType->images = $items->pluck('image_path')->toArray();
            return $roomType;
        });

        return response()->json($formattedData->values()->first());
    }
    public function update($id, Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'capacity' => 'required|integer|max:255',
        ]);
        DB::beginTransaction();
        try {
            DB::table('room_types')->where('id', $id)->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'capacity' => $request->capacity,
            ]);
            if ($request->hasFile('images')) {
                // Delete old images
                $oldImages = DB::table('images')->where('room_type_id', $id)->get();
                foreach ($oldImages as $image) {
                    Storage::disk('public')->delete($image->path);
                }
                DB::table('images')->where('room_type_id', $id)->delete();

                // Store new images
                foreach ($request->file('images') as $file) {
                    $path = $file->store('images', 'public');
                    DB::table('images')->insert([
                        'path' => $path,
                        'room_type_id' => $id,
                    ]);
                }
            }
            DB::commit();
            return response()->json(['message' => 'Thay đổi thành công'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
