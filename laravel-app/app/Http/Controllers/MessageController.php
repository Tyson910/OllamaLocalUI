<?php

namespace App\Http\Controllers;

// use App\Models\Message;
use App\Models\Convo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
// use Inertia\Inertia;
// use Inertia\Response;

class MessageController extends Controller
{
    // /**
    //  * Display a listing of the resource.
    //  */
    // public function index(): Response
    // {
    //     //
    //     return Inertia::render('Convos/Index', [
    //         // can add props here
    //     ]);
    // }

    // /**
    //  * Show the form for creating a new resource.
    //  */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'content' => 'required|string',
            'role' => 'required|string',
            'convo_id' => 'required|string',            
        ]);

        $convo = Convo::find($validated['convo_id']);
 
        $convo->messages()->create([
            'id' => Str::ulid()->toBase32(),
            'content' => $validated['content'],
            'role' => $validated['role'],
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    // public function show(Message $message)
    // {
    //     //
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(Message $message)
    // {
    //     //
    // }

    // /**
    //  * Update the specified resource in storage.
    //  */
    // public function update(Request $request, Message $message)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(Message $message)
    // {
    //     //
    // }
}
