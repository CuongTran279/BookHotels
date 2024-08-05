<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HotelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for($i = 0;$i<5;$i++){
            DB::table('hotels')->insert([
                'name'=>fake()->name(),
                'address'=>fake()->address(),
                'description'=>fake()->text(),
                'phone'=>fake()->phoneNumber(),
                
            ]);
        }
    }
}
