<?php

namespace App\Http\Controllers;

use App\Models\Convo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class ConvoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // TODO: use real id soon
        // $id = Auth::id();
        $id = '01HYHJ0BJ61NCG0CRR97H5MZ11';
        // get all convos for a user
        return Inertia::render('Convos/Index', [
            // can add props here
            'convos' => Convo::with('user:id,name')->where('user_id', $id)->latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $validated = $request->safe()->merge(['id' => Str::ulid()->toBase32()]);

        $request->user()->chats()->create($validated);

        return redirect(route('chats.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Convo $convo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convo $convo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convo $convo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convo $convo)
    {
        //
    }
}
