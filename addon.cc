#include <node_api.h>
#include <assert.h>
#include <stdio.h>

napi_value Fibonacci(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    if (argc < 1) {
        napi_throw_type_error(env, nullptr, "Wrong number of arguments");
        return nullptr;
    }

    napi_valuetype valuetype0;
    status = napi_typeof(env, args[0], &valuetype0);
    assert(status == napi_ok);

    if (valuetype0 != napi_number) {
        napi_throw_type_error(env, nullptr, "Wrong arguments");
        return nullptr;
    }

    double n;
    status = napi_get_value_double(env, args[0], &n);
    assert(status == napi_ok);

    double a = 0, b = 1;

    if (n == 0 || n == 1) {
        b = n;
    } else {
        for (int i = 2; i <= n; ++i) {
            b = a + b;
            a = b - a;
        }
    }

    napi_value result;
    status = napi_create_double(env, b, &result);
    assert(status == napi_ok);

    return result;

}

napi_value Factorial(napi_env env, napi_callback_info info) {
    napi_status status;

    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    if (argc < 1) {
        napi_throw_type_error(env, nullptr, "Wrong number of arguments");
        return nullptr;
    }

    napi_valuetype valuetype0;
    status = napi_typeof(env, args[0], &valuetype0);
    assert(status == napi_ok);

    if (valuetype0 != napi_number) {
        napi_throw_type_error(env, nullptr, "Wrong arguments");
        return nullptr;
    }

    double n;
    status = napi_get_value_double(env, args[0], &n);
    assert(status == napi_ok);

    double mul = 1;

    if (n != 0) {
        for (int i = 1; i <= n; ++i) {
            mul *= i;
        }
    }

    napi_value result;
    status = napi_create_double(env, mul, &result);
    assert(status == napi_ok);

    return result;

}

#define DECLARE_NAPI_METHOD(name, func) { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_property_descriptor properties[] = {
    DECLARE_NAPI_METHOD("fibonacci", Fibonacci),
    DECLARE_NAPI_METHOD("factorial", Factorial),
};

napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    status = napi_define_properties(env, exports, sizeof(properties) / sizeof(properties[0]), properties);
    assert(status == napi_ok);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
