<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Model;

class Convo extends Model
{
    use HasFactory, HasUlids;

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }


    protected $fillable = [
        'title',
    ];
}
