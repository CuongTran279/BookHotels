<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    //
    public function getDashboardData($type)
    {
        switch ($type) {
            case 'roomQuantity':
                $result = DB::table('rooms')
                    ->select(DB::raw('SUM(quantity) as roomSum'))
                    ->first();
                break;
            case 'sumPrice':
                $result = DB::table('bills')
                    ->select(DB::raw('SUM(total) as total'))
                    ->first();
                break;
            case 'userQuantity':
                $result = DB::table('users')
                    ->select(DB::raw('COUNT(id) as user'))
                    ->first();
                break;
            case 'sumHotel':
                $result = DB::table('hotels')
                    ->select(DB::raw('COUNT(id) as hotels'))
                    ->first();
                break;
            case 'hotelByCity':
                $result = DB::table('hotels')
                    ->leftJoin('cities', 'cities.name', '=', 'hotels.city')
                    ->select('cities.name as city', DB::raw('COUNT(hotels.id) as hotel'))
                    ->groupBy('cities.name')
                    ->get();
                break;
            case 'roomsByHotel':
                $result = DB::table('hotels')
                    ->leftJoin('rooms', 'rooms.hotel_id', '=', 'hotels.id')
                    ->select('hotels.name as name', DB::raw('SUM(quantity) as rooms'))
                    ->groupBy('hotels.name')
                    ->get();
                break;
            case 'hotelByViews':
                $result = DB::table('hotels')
                    ->select('name', 'views')
                    ->get();
                break;
            case 'hotelBuyMost':
                $result = DB::table('hotels')
                    ->leftJoin('cart', 'cart.hotel_id', '=', 'hotels.id')
                    ->select('hotels.name as name', DB::raw('COUNT(hotels.name) as quantity'))
                    ->groupBy('hotels.name')
                    ->where('cart.status','!=',1)
                    ->get();
                break;
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        return response()->json($result);
    }
}
