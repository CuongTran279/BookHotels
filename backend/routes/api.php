<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoomTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Login
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('viewUser', [AuthController::class, 'viewUser']);
    Route::post('updateUser/{id}', [AuthController::class, 'updateUser']);
});
// roomType
Route::group([
    'middleware' => 'api',
    'prefix' => 'roomType'
], function ($router) {

    Route::post('admin/addRoomType', [RoomTypeController::class, 'add']);
    Route::get('admin/roomType', [RoomTypeController::class, 'view']);
    Route::get('admin/roomTypeById/{id}', [RoomTypeController::class, 'viewById']);
    Route::delete('admin/deleteRoomType/{id}', [RoomTypeController::class, 'delete']);
    Route::post('admin/updateRoomType/{id}', [RoomTypeController::class, 'update']);
});
// City
Route::group([
    'middleware' => 'api',
    'prefix' => 'city'
], function ($router) {
    Route::post('admin/addCity', [CityController::class, 'add']);
    Route::get('admin/city', [CityController::class, 'view']);
    Route::delete('admin/deleteCity/{id}', [CityController::class, 'delete']);
    Route::get('admin/cityById/{id}', [CityController::class, 'viewById']);
    Route::post('admin/updateCity/{id}', [CityController::class, 'update']);
});
// Hotel
Route::group([
    'middleware' => 'api',
    'prefix' => 'hotel'
], function ($router) {
    Route::post('admin/addHotel', [HotelController::class, 'add']);
    Route::get('admin/hotel', [HotelController::class, 'view']);
    Route::get('admin/hotelByCity/{id}', [HotelController::class, 'viewByCity']);
    Route::delete('admin/deleteHotel/{id}', [HotelController::class, 'delete']);
    Route::get('admin/hotelById/{id}', [HotelController::class, 'viewById']);
    Route::get('admin/viewHotelByCity/{id}', [HotelController::class, 'viewHotelByCity']);
    Route::post('admin/updateHotel/{id}', [HotelController::class, 'update']);
});
// Search and Cart
Route::group([
    'middleware' => 'api',
    'prefix' => 'bill'
], function ($router) {
    // Search
    Route::post('admin/searchRoom/{id}', [BillController::class, 'searchRoom']);
    Route::post('admin/searchMainRoom', [BillController::class, 'searchMainRoom']);
    Route::get('admin/price', [BillController::class, 'price']);
    Route::post('admin/filter', [BillController::class, 'filter']);
    // Cart
    Route::post('admin/addCart', [CartController::class, 'addCart']);
    Route::get('admin/viewCart/{id}', [CartController::class, 'viewCart']);
    Route::post('admin/deleteCart', [CartController::class, 'deleteCart']);
    Route::post('admin/bookHotel', [CartController::class, 'bookHotel']);
    // Update Status
    Route::get('admin/updateStatus', [BillController::class, 'updateStatus']);
    Route::get('admin/updateDay', [BillController::class, 'updateDay']);
    //  Get Bill
    Route::get('admin/viewBillByUserId/{id}', [BillController::class, 'viewBillByUserId']);
    Route::get('admin/viewBill', [BillController::class, 'viewBill']);
    Route::post('admin/updateBill/{id}', [BillController::class, 'updateBill']);
    // Comment
    Route::post('admin/comment', [BillController::class, 'comment']);
    Route::get('admin/commentByHotel/{id}', [BillController::class, 'commentByHotel']);
});
// Dashboard
Route::group([
    'middleware' => 'api',
    'prefix' => 'dashboard'
], function ($router) {
    Route::get('admin/{type}', [DashboardController::class, 'getDashboardData']);
});
