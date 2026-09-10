import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/recurring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecurringTransactionController::index
 * @see app/Http/Controllers/RecurringTransactionController.php:15
 * @route '/recurring'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\RecurringTransactionController::store
 * @see app/Http/Controllers/RecurringTransactionController.php:29
 * @route '/recurring'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/recurring',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecurringTransactionController::store
 * @see app/Http/Controllers/RecurringTransactionController.php:29
 * @route '/recurring'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTransactionController::store
 * @see app/Http/Controllers/RecurringTransactionController.php:29
 * @route '/recurring'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecurringTransactionController::store
 * @see app/Http/Controllers/RecurringTransactionController.php:29
 * @route '/recurring'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecurringTransactionController::store
 * @see app/Http/Controllers/RecurringTransactionController.php:29
 * @route '/recurring'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
export const edit = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/recurring/{recurringTransaction}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
edit.url = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurringTransaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { recurringTransaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    recurringTransaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recurringTransaction: typeof args.recurringTransaction === 'object'
                ? args.recurringTransaction.id
                : args.recurringTransaction,
                }

    return edit.definition.url
            .replace('{recurringTransaction}', parsedArgs.recurringTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
edit.get = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
edit.head = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
    const editForm = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
        editForm.get = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecurringTransactionController::edit
 * @see app/Http/Controllers/RecurringTransactionController.php:44
 * @route '/recurring/{recurringTransaction}/edit'
 */
        editForm.head = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\RecurringTransactionController::update
 * @see app/Http/Controllers/RecurringTransactionController.php:54
 * @route '/recurring/{recurringTransaction}'
 */
export const update = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/recurring/{recurringTransaction}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RecurringTransactionController::update
 * @see app/Http/Controllers/RecurringTransactionController.php:54
 * @route '/recurring/{recurringTransaction}'
 */
update.url = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurringTransaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { recurringTransaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    recurringTransaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recurringTransaction: typeof args.recurringTransaction === 'object'
                ? args.recurringTransaction.id
                : args.recurringTransaction,
                }

    return update.definition.url
            .replace('{recurringTransaction}', parsedArgs.recurringTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTransactionController::update
 * @see app/Http/Controllers/RecurringTransactionController.php:54
 * @route '/recurring/{recurringTransaction}'
 */
update.patch = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\RecurringTransactionController::update
 * @see app/Http/Controllers/RecurringTransactionController.php:54
 * @route '/recurring/{recurringTransaction}'
 */
    const updateForm = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecurringTransactionController::update
 * @see app/Http/Controllers/RecurringTransactionController.php:54
 * @route '/recurring/{recurringTransaction}'
 */
        updateForm.patch = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\RecurringTransactionController::destroy
 * @see app/Http/Controllers/RecurringTransactionController.php:65
 * @route '/recurring/{recurringTransaction}'
 */
export const destroy = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/recurring/{recurringTransaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RecurringTransactionController::destroy
 * @see app/Http/Controllers/RecurringTransactionController.php:65
 * @route '/recurring/{recurringTransaction}'
 */
destroy.url = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurringTransaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { recurringTransaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    recurringTransaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recurringTransaction: typeof args.recurringTransaction === 'object'
                ? args.recurringTransaction.id
                : args.recurringTransaction,
                }

    return destroy.definition.url
            .replace('{recurringTransaction}', parsedArgs.recurringTransaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTransactionController::destroy
 * @see app/Http/Controllers/RecurringTransactionController.php:65
 * @route '/recurring/{recurringTransaction}'
 */
destroy.delete = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RecurringTransactionController::destroy
 * @see app/Http/Controllers/RecurringTransactionController.php:65
 * @route '/recurring/{recurringTransaction}'
 */
    const destroyForm = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecurringTransactionController::destroy
 * @see app/Http/Controllers/RecurringTransactionController.php:65
 * @route '/recurring/{recurringTransaction}'
 */
        destroyForm.delete = (args: { recurringTransaction: number | { id: number } } | [recurringTransaction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const recurring = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default recurring