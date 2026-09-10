<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JoinHouseholdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'invite_code' => strtoupper($this->input('invite_code')),
        ]);
    }

    public function rules(): array
    {
        return [
            'invite_code' => ['required', 'string', 'regex:/^[A-Z0-9]+$/'],
        ];
    }
}