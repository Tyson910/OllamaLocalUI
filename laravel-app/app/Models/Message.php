<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use App\Models\Convo;

class Message extends Model
{
    use HasFactory, HasUlids;

    public function convo(): BelongsTo
    {
        return $this->belongsTo(Convo::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'role',
    ];

    /**
     * Get the messages's user.
     */
    public function messageOwner(): HasOneThrough
    {
        return $this->through('convo')->has('user');
    }
}
