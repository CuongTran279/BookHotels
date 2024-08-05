<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = DB::table('users')->where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không đúng'], 401);
        }
        return response()->json($user);
    }

    public function register(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'phone' => 'required|string|max:15',
            'email' => 'required|string|email|max:255',
            'address' => 'required|string|max:255',
            'fullName' => 'required|string|max:255',
        ]);
        // Kiểm tra tài khoản
        $check = DB::table('users')->where('email', $request->email)->first();
        if ($check) {
            return response()->json(['error' => 'Tài khoản đã tồn tại'], 400);
        }
        // Thêm dữ liệu
        DB::table('users')->insert([
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'fullName' => $request->fullName,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response()->json(['message' => 'Đăng ký thành công'], 201);
    }
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function viewUser(){
        $users = DB::table('users')->get();
        return response()->json($users);
    }

    public function updateUser($id,Request $request){
        DB::table('users')
        ->where('users.id','=', $id)
        ->update([
            'role'=>$request[0]
        ]);
    }
}
