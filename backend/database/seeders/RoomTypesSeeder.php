<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roomTypeSeed= [];
        for($i = 0;$i<5;$i++){
            DB::table('room_types')->insert([
                'name'=>fake()->name(),
                'description'=>fake()->text(),
                'capacity'=>fake()->numberBetween(1,8)
            ]);
        }
    }
}
