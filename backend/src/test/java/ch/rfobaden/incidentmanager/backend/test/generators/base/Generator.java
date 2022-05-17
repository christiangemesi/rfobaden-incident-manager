package ch.rfobaden.incidentmanager.backend.test.generators.base;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Component
@Import(TestConfig.class)
public abstract class Generator<T> {
    @Autowired
    protected Faker faker;

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
     * Generate a boolean that is {@code true} half of the time.
     *
     * @return the generated boolean.
     */
    public boolean randomBoolean() {
        return faker.bool().bool();
    }

    /**
     * Do something half of the time.
     * This method is meant to be used for generating optional test data.
     *
     * @param action The action which is executed half of the time.
     * @param <R> The type of the value generated by the action.
     * @return The value generated by {@code action}, or {@code null},
     *         if the action was not executed.
     */
    public <R> R doMaybe(Supplier<R> action) {
        if (randomBoolean()) {
            return action.get();
        }
        return null;
    }

    public LocalDateTime randomDateTime() {
        return LocalDateTime.now()
            .withNano(0)
            .minusDays(faker.random().nextInt(0, 365 * 1000));
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
            var clazz = value.getClass();
            Constructor<T> defaultConstructor = null;
            @SuppressWarnings("unchecked") var constructors =
                (Constructor<T>[]) clazz.getConstructors();
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
            var properties = getProperties(value);

            var currentClass = clazz;
            do {
                for (var field : currentClass.getDeclaredFields()) {
                    @SuppressWarnings("unchecked")
                    var property = (Property<T, Object>) properties.get(field.getName());
                    if (property == null) {
                        continue;
                    }
                    property.set(newValue, property.get(value));
                }
                currentClass = currentClass.getSuperclass();
            } while (currentClass != null);
            return newValue;
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException e) {
            throw new IllegalStateException("failed to copy", e);
        }
    }

    public Map<String, Property<T, ?>> getProperties(T value) {
        var clazz = value.getClass();
        var methods = Arrays.stream(clazz.getMethods())
            .filter((method) -> (
                method.getName().startsWith("get") || method.getName().startsWith("set")
            ))
            .collect(Collectors.toMap(
                Method::getName,
                (method) -> method
            ));
        var properties = new HashMap<String, Property<T, ?>>();
        methods.forEach((methodName, getter) -> {
            if (!methodName.startsWith("get")) {
                return;
            }
            var setter = methods.get("set" + methodName.substring(3));
            if (setter == null) {
                return;
            }
            var name = Character.toLowerCase(methodName.charAt(3)) + methodName.substring(4);

            @SuppressWarnings("unchecked")
            var type = (Class<Object>) getter.getReturnType();
            properties.put(name, new Property<>() {
                @Override
                public Class<Object> getType() {
                    return type;
                }

                @Override
                public Object get(T target) {
                    try {
                        return getter.invoke(target);
                    } catch (IllegalAccessException | InvocationTargetException e) {
                        throw new IllegalStateException("failed to access property getter", e);
                    }
                }

                @Override
                public void set(T target, Object value) {
                    try {
                        setter.invoke(target, value);
                    } catch (IllegalAccessException | InvocationTargetException e) {
                        throw new IllegalStateException("failed to access property setter", e);
                    }
                }

                @Override
                public String toString() {
                    return clazz.getSimpleName() + "." + name;
                }
            });
        });
        return properties;
    }

    public interface Property<T, TValue> {
        Class<TValue> getType();

        TValue get(T target);

        void set(T target, TValue value);
    }
}
