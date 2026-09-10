<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'type' => ['required', 'in:expense,income'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'max:3'],
            'date' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:1000'],
            'visibility' => ['required', 'in:private,shared'],
            'receipt' => ['nullable', 'image', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => __('Please choose a category.'),
            'amount.required' => __('Please enter an amount.'),
            'amount.min' => __('The amount must be greater than zero.'),
        ];
    }
}