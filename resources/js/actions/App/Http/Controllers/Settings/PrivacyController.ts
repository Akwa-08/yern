import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\PrivacyController::edit
 * @see app/Http/Controllers/Settings/PrivacyController.php:14
 * @route '/settings/privacy'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\PrivacyController::update
 * @see app/Http/Controllers/Settings/PrivacyController.php:19
 * @route '/settings/privacy'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/privacy',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\PrivacyController::update
 * @see app/Http/Controllers/Settings/PrivacyController.php:19
 * @route '/settings/privacy'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\PrivacyController::update
 * @see app/Http/Controllers/Settings/PrivacyController.php:19
 * @route '/settings/privacy'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\PrivacyController::update
 * @see app/Http/Controllers/Settings/PrivacyController.php:19
 * @route '/settings/privacy'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\PrivacyController::update
 * @see app/Http/Controllers/Settings/PrivacyController.php:19
 * @route '/settings/privacy'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const PrivacyController = { edit, update }

export default PrivacyController