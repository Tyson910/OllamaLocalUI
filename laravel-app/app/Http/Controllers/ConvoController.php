<?php

namespace App\Http\Controllers;

use App\Models\Convo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ConvoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $id = Auth::id();

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

        $validatedReq = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $request->user()->convos()->create([
            'title' => $validatedReq['title'],
            'id' => Str::ulid()->toBase32(),
            'user_id' => Auth::id(),
        ]);

        return redirect(route('convos.index'));
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
    public function update(Request $request, Convo $convo): RedirectResponse
    {
        Gate::authorize('update', $convo);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $convo->update($validated);

        return redirect(route('convos.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convo $convo): RedirectResponse
    {
        Gate::authorize('update', $convo);
        $convo->delete();
        return redirect(route('convos.index'));
    }
}
