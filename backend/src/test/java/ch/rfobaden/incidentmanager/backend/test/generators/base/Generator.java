package ch.rfobaden.incidentmanager.backend.test.generators.base;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Supplier;

public abstract class Generator<T> {
    public abstract T generate();

    public final List<T> generate(int amount) {
        return generate(amount, this::generate);
    }

    protected static <T> List<T> generate(int amount, Supplier<T> generate) {
        var records = new ArrayList<T>(amount);
        for (int i = 0; i < amount; i++) {
            records.add(generate.get());
        }
        return records;
    }

    /**
     * Shallow copy of a value, using reflection.
     * Not very pretty, not entirely safe, definitely only usable in testing.
     *
     * <p>
     * This could be made abstract if we ever want to move away from the unsafe,
     * reflection-based type of copying.
     * </p>
     *
     * @param value the value to copy
     *
     * @return a shallow copy of {@code value}
     */
    public T copy(T value) {
        try {
            Constructor<T> defaultConstructor = null;
            @SuppressWarnings("unchecked") var constructors =
                (Constructor<T>[]) value.getClass().getConstructors();
            for (var constructor : constructors) {
                if (constructor.getParameterCount() == 0) {
                    defaultConstructor = constructor;
                    break;
                }
            }
            if (defaultConstructor == null) {
                throw new IllegalStateException("can't copy without a default constructor");
            }
            var newValue = defaultConstructor.newInstance();
            var methods = value.getClass().getMethods();
            Arrays.stream(methods)
                .filter(method -> method.getName().startsWith("get"))
                .filter(method -> method.getParameterCount() == 0)
                .forEach(getter -> {
                    var fieldName = getter.getName().substring(3);
                    var setter = Arrays.stream(methods)
                        .filter(method -> method.getName().startsWith("set" + fieldName))
                        .filter(method -> method.getParameterCount() == 1)
                        .findFirst()
                        .orElse(null);
                    if (setter == null) {
                        return;
                    }
                    try {
                        var propertyValue = getter.invoke(value);
                        setter.invoke(newValue, propertyValue);
                    } catch (IllegalAccessException | InvocationTargetException e) {
                        throw new IllegalStateException("failed to copy " + fieldName);
                    }
                });
            return newValue;
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
            throw new IllegalStateException("failed to copy", e);
        }
    }
}