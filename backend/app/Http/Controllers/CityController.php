<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CityController extends Controller
{
    public function add(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate ảnh
        ]);

        if ($request->file('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            DB::table('cities')->insert([
                'name' => $request->name,
                'image' => $imagePath,
            ]);

            return response()->json(['message' => 'Thêm mới thành công'], 201);
        }

        return response()->json(['error' => 'Lỗi'], 400);
    }
    public function view()
    {
        $roomTypes = DB::table('cities')->get();
        return response()->json($roomTypes->values()); // Use values() to get a non-associative array
    }

    public function delete($id)
    {
        DB::table('cities')->where('id', $id)->delete();
        return response()->json(['message' => 'Xóa thành công'], 201);
    }

    public function viewById($id)
    {
        $city = DB::table('cities')->where('id', $id)->get();
        return response()->json($city->values()->first());
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Lấy thông tin phòng hiện tại từ cơ sở dữ liệu
        $city = DB::table('cities')->where('id', $id)->first();

        if (!$city) {
            return response()->json(['error' => 'City not found'], 404);
        }

        if ($request->hasFile('image')) {
            // Xóa ảnh cũ từ thư mục lưu trữ
            if ($city->image && Storage::disk('public')->exists($city->image)) {
                Storage::disk('public')->delete($city->image);
            }

            // Lưu ảnh mới
            $newImagePath = $request->file('image')->store('images', 'public');

            // Cập nhật thông tin trong cơ sở dữ liệu
            DB::table('cities')->where('id', $id)->update([
                'name' => $request->name,
                'image' => $newImagePath,
            ]);

            return response()->json(['message' => 'Cập nhật thành công'], 200);
        } else {
            // Nếu không có ảnh mới, chỉ cập nhật tên
            DB::table('cities')->where('id', $id)->update([
                'name' => $request->name,
            ]);

            return response()->json(['message' => 'Cập nhật thành công'], 200);
        }
    }
}
