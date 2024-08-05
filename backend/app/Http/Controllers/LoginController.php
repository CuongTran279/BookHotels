<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
class LoginController extends Controller
{
    public function login(Request $request)
    {
        $check = $request->only('name', 'pass');

    // Sử dụng Auth::attempt để xác thực người dùng
    if (Auth::attempt($check)) {
        $user = Auth::user();

        // Kiểm tra mật khẩu bằng Hash::check
        if (!Hash::check($request->pass, $user->pass)) {
            return response()->json(['error' => 'Thông tin đăng nhập không chính xác'], 401);
        }

        // Tạo token với Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Trả về token và loại token
        return response()->json([
            'msg' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }
}
}
