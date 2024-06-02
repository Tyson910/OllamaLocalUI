<?php

namespace App\Policies;

use App\Models\Convo;
use App\Models\User;

// use Illuminate\Auth\Access\Response;

class ConvoPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Convo $convo): bool
    {
        return $convo->user()->is($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // anyone can create a model
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Convo $convo): bool
    {
        // same logic as view method
        return $this->view($user, $convo);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Convo $convo): bool
    {
        // same logic as view method
        return $this->view($user, $convo);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Convo $convo): bool
    {
        // same logic as view method
        return $this->view($user, $convo);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Convo $convo): bool
    {
        return $this->view($user, $convo);
    }
}