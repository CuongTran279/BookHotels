<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    //

    public function addCart(Request $request)
    {
        // Log::info('Request data:', $request->all());
        $existingCartItem = DB::table('cart')
            ->where('user_id', $request->userId)
            ->where('hotel_id', $request->hotelId)
            ->where('room_type_id', $request->roomTypeId)
            ->where('getIn', $request->getIn)
            ->where('getOut', $request->getOut)
            ->first();
        if ($existingCartItem) {
            DB::table('cart')
                ->where('user_id', $request->userId)
                ->where('hotel_id', $request->hotelId)
                ->where('room_type_id', $request->roomTypeId)
                ->where('getIn', $request->getIn)
                ->where('getOut', $request->getOut)
                ->update([
                    'quantity' => $existingCartItem->quantity + $request->quantity,
                    'capacity' => $existingCartItem->capacity + $request->people,
                    'price' => $existingCartItem->price + $request->price,
                ]);
            return response()->json(['message' => 'Thêm mới thành công'], 201);
        } else {
            DB::table('cart')->insert([
                'user_id' => $request->userId,
                'hotel_id' => $request->hotelId,
                'room_type_id' => $request->roomTypeId,
                'quantity' => $request->quantity,
                'capacity' => $request->people,
                'price' => $request->price,
                'getIn' => $request->getIn,
                'getOut' => $request->getOut,
            ]);
            return response()->json(['message' => 'Thêm mới thành công'], 201);
        }
    }

    public function viewCart($id)
    {
        $cart = DB::table('cart')
            ->leftJoin('hotels', 'hotels.id', '=', 'cart.hotel_id')
            ->leftJoin('room_types', 'room_types.id', '=', 'cart.room_type_id')
            ->leftJoin('images', 'images.room_type_id', '=', 'room_types.id')
            ->select(
                'hotels.id',
                'hotels.image',
                'hotels.name',
                'hotels.address',
                'hotels.city',
                'hotels.description',
                'hotels.phone',
                'room_types.name as roomTypeName',
                'room_types.description as roomTypeDescription',
                'room_types.id as roomTypeId',
                'cart.quantity',
                'cart.id as cartId',
                'cart.capacity',
                'cart.price',
                'cart.getIn',
                'cart.getOut',
                'cart.status',
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
                'room_types.name',
                'room_types.id',
                'room_types.description',
                'cart.quantity',
                'cart.capacity',
                'cart.id',
                'cart.price',
                'cart.getIn',
                'cart.getOut',
                'cart.status',
            )
            ->where('user_id', '=', $id)
            ->where('status', '=', 1)
            ->get();
        return response()->json($cart);
    }

    public function deleteCart(Request $request)
    {
        // Tạo collection từ dữ liệu request
        $data = collect($request->all());
        // Lấy ra các cartId từ collection
        $cartIds = $data->pluck('cartId');
        foreach ($cartIds as $cartId) {
            DB::table('cart')->where('id', $cartId)->delete();
        }
        return response()->json(['message' => 'Xóa thành công'], 200);
    }

    public function bookHotel(Request $request)
    {
        $cartArray = json_decode($request->cart, true);
        $user = json_decode($request->user, true);

        if (!isset($user['id']) || !is_array($cartArray)) {
            return response()->json(['message' => 'Dữ liệu người dùng hoặc giỏ hàng không hợp lệ'], 400);
        }

        $userId = $user['id'];
        $cartIds = array_column($cartArray, 'cartId');

        DB::beginTransaction();
        try {
            $carts = DB::table('cart')->whereIn('id', $cartIds)->get();
            foreach ($carts as $cart) {
                $room = DB::table('rooms')
                    ->where('hotel_id', $cart->hotel_id)
                    ->where('room_type_id', $cart->room_type_id)
                    ->first();

                if (!$room) {
                    DB::rollBack();
                    return response()->json(['message' => 'Phòng không tồn tại'], 400);
                }

                if ($room->count < $cart->quantity) {
                    DB::rollBack();
                    return response()->json(['message' => 'Số lượng phòng không đủ'], 400);
                }
            }

            $bill = DB::table('bills')->insertGetId([
                'user_id' => $userId,
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'total' => $request->price,
            ]);

            foreach ($cartIds as $cartId) {
                DB::table('bill_detaills')->insert([
                    'cart_id' => $cartId,
                    'bill_id' => $bill,
                ]);

                DB::table('cart')->where('id', $cartId)->update([
                    'status' => '0',
                ]);
            }

            foreach ($carts as $cart) {
                DB::table('rooms')
                    ->where('hotel_id', $cart->hotel_id)
                    ->where('room_type_id', $cart->room_type_id)
                    ->update([
                        'count' => DB::raw('count - ' . $cart->quantity),
                    ]);
            }

            DB::commit();

            // Tạo yêu cầu thanh toán VNPay
            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = "http://localhost:3000/profile";
            $vnp_TmnCode = "3G5B84OE"; // Mã website tại VNPay
            $vnp_HashSecret = "OCBF3M7S9A8FAX62OAMQJ63KGSUJEHE6"; // Chuỗi bí mật

            $vnp_TxnRef = $bill; // Mã đơn hàng. Trong thực tế, bạn nên tạo mã duy nhất cho từng giao dịch
            $vnp_OrderInfo = "Thanh toán hóa đơn #";
            $vnp_OrderType = "billpayment";
            $vnp_Amount = $request->price * 100; // Số tiền (đơn vị VND)
            $vnp_Locale = 'vn';
            $vnp_BankCode = 'NCB';
            $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

            $inputData = array(
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef,
            );

            if (isset($vnp_BankCode) && $vnp_BankCode != "") {
                $inputData['vnp_BankCode'] = $vnp_BankCode;
            }
            ksort($inputData);
            $query = "";
            $i = 0;
            $hashdata = "";
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnp_Url = $vnp_Url . "?" . $query;
            if (isset($vnp_HashSecret)) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
                $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
            }
            return response()->json(['message' => 'Thêm mới thành công', 'payment_url' => $vnp_Url], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 400);
        }
    }
}
