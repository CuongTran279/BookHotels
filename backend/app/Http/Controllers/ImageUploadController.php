<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('upload')) {
            $file = $request->file('upload');
            $path = $file->store('public/images');
            $url = Storage::url($path);

            return response()->json([
                'uploaded' => true,
                'url' => asset($url),
            ]);
        }

        return response()->json([
            'uploaded' => false,
            'error' => [
                'message' => 'No file uploaded'
            ]
        ]);
    }
}