<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roomTypeId = DB::table('room_types')->pluck('id')->toArray();
        $hotelId = DB::table('hotels')->pluck('id')->toArray();
        for($i = 0;$i<7;$i++){
            DB::table('rooms')->insert([
                'hotel_id'=>fake()->randomElement($hotelId),
                'room_type_id'=>fake()->randomElement($roomTypeId),
                'quantity'=>fake()->randomNumber(),
                'status'=>fake()->numberBetween(0,1),
            ]);
        }
    }
}
