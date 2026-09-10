import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/households',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HouseholdController::index
 * @see app/Http/Controllers/HouseholdController.php:16
 * @route '/households'
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
* @see \App\Http\Controllers\HouseholdController::store
 * @see app/Http/Controllers/HouseholdController.php:25
 * @route '/households'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/households',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HouseholdController::store
 * @see app/Http/Controllers/HouseholdController.php:25
 * @route '/households'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HouseholdController::store
 * @see app/Http/Controllers/HouseholdController.php:25
 * @route '/households'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\HouseholdController::store
 * @see app/Http/Controllers/HouseholdController.php:25
 * @route '/households'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HouseholdController::store
 * @see app/Http/Controllers/HouseholdController.php:25
 * @route '/households'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\HouseholdController::join
 * @see app/Http/Controllers/HouseholdController.php:47
 * @route '/households/join'
 */
export const join = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: join.url(options),
    method: 'post',
})

join.definition = {
    methods: ["post"],
    url: '/households/join',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HouseholdController::join
 * @see app/Http/Controllers/HouseholdController.php:47
 * @route '/households/join'
 */
join.url = (options?: RouteQueryOptions) => {
    return join.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HouseholdController::join
 * @see app/Http/Controllers/HouseholdController.php:47
 * @route '/households/join'
 */
join.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: join.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\HouseholdController::join
 * @see app/Http/Controllers/HouseholdController.php:47
 * @route '/households/join'
 */
    const joinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: join.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HouseholdController::join
 * @see app/Http/Controllers/HouseholdController.php:47
 * @route '/households/join'
 */
        joinForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: join.url(options),
            method: 'post',
        })
    
    join.form = joinForm
/**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
export const show = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/households/{household}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
show.url = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { household: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { household: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    household: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        household: typeof args.household === 'object'
                ? args.household.id
                : args.household,
                }

    return show.definition.url
            .replace('{household}', parsedArgs.household.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
show.get = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
show.head = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
    const showForm = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
        showForm.get = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HouseholdController::show
 * @see app/Http/Controllers/HouseholdController.php:75
 * @route '/households/{household}'
 */
        showForm.head = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const HouseholdController = { index, store, join, show }

export default HouseholdController