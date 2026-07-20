import { useForm } from "@tanstack/react-form";
import { Fragment } from "react";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import {
  AlarmClockIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Separator, Switch, useToast } from "heroui-native";
import { Button } from "heroui-native/button";
import { FieldError } from "heroui-native/field-error";
import { Spinner } from "heroui-native/spinner";
import { Typography } from "heroui-native/text";

import { SettingsRow } from "@/features/settings/components/settings-row";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { formatPocketBaseError, getFieldError } from "@/utils/errors";
import { logger } from "@/utils/logger";

import { FREQUENCIES, ROUTINES } from "../data/form-data";
import { createHabit } from "../lib/create-habit";
import {
  habitFormSchema,
  todayIsoDate,
  type HabitFormInput,
  type HabitFormValues,
} from "../schemas/habit-form";
import {
  dateFromMonthlyDay,
  dateFromReminderTime,
  formatMonthlyDay,
  formatReminderTime,
  HabitDateTimePickerRow,
  monthlyDayFromDate,
  reminderTimeFromDate,
} from "./habit-datetime-picker-row";
import { HabitDayChips } from "./habit-day-chips";
import { HabitFormField } from "./habit-form-field";

type HabitFormProps = {
  onSuccess?: (values: HabitFormValues) => void;
};

function SelectedCheck() {
  const accent = useCSSVariable("--color-accent");
  const color = typeof accent === "string" ? accent : "#007AFF";
  return (
    <HugeiconsIcon
      icon={CheckmarkCircle02Icon}
      size={22}
      color={color}
      strokeWidth={1.75}
    />
  );
}

function createDefaultValues(): HabitFormInput {
  return {
    name: "",
    description: "",
    routine: "morning",
    frequency: "daily",
    weeklyDays: undefined,
    monthlyDay: undefined,
    startDate: todayIsoDate(),
    reminderEnabled: false,
    reminderTime: "",
    targetCount: undefined,
    unit: "",
  };
}

export default function HabitForm({ onSuccess }: HabitFormProps) {
  const { toast } = useToast();

  const form = useForm({
    defaultValues: createDefaultValues(),
    validators: {
      onSubmit: habitFormSchema,
    },
    onSubmitInvalid: () => {
      toast.show({
        variant: "danger",
        label: "Check the form",
        description: "Fix the highlighted fields and try again.",
      });
    },
    onSubmit: async ({ value }) => {
      try {
        const parsed = habitFormSchema.parse(value);
        const record = await createHabit(parsed);
        logger.info("habit form submitted", record);
        form.reset();
        toast.show({
          variant: "success",
          label: "Habit saved",
          description: "Your habit was created successfully.",
        });
        onSuccess?.(parsed);
      } catch (error) {
        const description = formatPocketBaseError(error);
        logger.error("habit form submission error", description);
        toast.show({
          variant: "danger",
          label: "Couldn't save habit",
          description,
        });
      }
    },
  });

  return (
    <View className="gap-6">
      <SettingsSection title="Basics">
        <form.Field name="name">
          {(field) => (
            <HabitFormField
              label="Name"
              required
              placeholder="e.g. Morning stretch"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              autoCapitalize="sentences"
              maxLength={100}
              returnKeyType="next"
            />
          )}
        </form.Field>
        <Separator className="mx-4" />
        <form.Field name="description">
          {(field) => (
            <HabitFormField
              label="Note"
              placeholder="Add context if you want"
              value={field.state.value ?? ""}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              multiline
              maxLength={255}
            />
          )}
        </form.Field>
      </SettingsSection>

      <SettingsSection title="Time of day">
        <form.Field name="routine">
          {(field) => (
            <>
              {ROUTINES.map((routine, index) => (
                <Fragment key={routine.value}>
                  {index > 0 ? <Separator className="ml-14 mr-4" /> : null}
                  <SettingsRow
                    title={routine.title}
                    description={routine.description}
                    icon={routine.icon}
                    iconBackground={routine.iconBackground}
                    iconColor={routine.iconColor}
                    trailing={
                      field.state.value === routine.value ? (
                        <SelectedCheck />
                      ) : null
                    }
                    onPress={() => field.handleChange(routine.value)}
                  />
                </Fragment>
              ))}
              {getFieldError(field.state.meta.errors) ? (
                <View className="px-4 pb-3">
                  <FieldError isInvalid>
                    {getFieldError(field.state.meta.errors)}
                  </FieldError>
                </View>
              ) : null}
            </>
          )}
        </form.Field>
      </SettingsSection>

      <SettingsSection title="Schedule">
        <form.Field name="frequency">
          {(field) => (
            <>
              {FREQUENCIES.map((frequency, index) => (
                <Fragment key={frequency.value}>
                  {index > 0 ? <Separator className="ml-14 mr-4" /> : null}
                  <SettingsRow
                    title={frequency.title}
                    description={frequency.description}
                    icon={frequency.icon}
                    iconBackground={frequency.iconBackground}
                    trailing={
                      field.state.value === frequency.value ? (
                        <SelectedCheck />
                      ) : null
                    }
                    onPress={() => {
                      field.handleChange(frequency.value);
                      if (frequency.value !== "weekly") {
                        form.setFieldValue("weeklyDays", undefined);
                      }
                      if (frequency.value !== "monthly") {
                        form.setFieldValue("monthlyDay", undefined);
                      }
                    }}
                  />
                </Fragment>
              ))}
            </>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.frequency}>
          {(frequency) =>
            frequency === "weekly" ? (
              <>
                <Separator className="mx-4" />
                <form.Field name="weeklyDays">
                  {(field) => (
                    <HabitDayChips
                      value={field.state.value}
                      onChange={field.handleChange}
                      error={getFieldError(field.state.meta.errors)}
                    />
                  )}
                </form.Field>
              </>
            ) : frequency === "monthly" ? (
              <>
                <Separator className="mx-4" />
                <form.Field name="monthlyDay">
                  {(field) => (
                    <HabitDateTimePickerRow
                      title="Day of month"
                      description="Repeats on this day each month"
                      required
                      mode="date"
                      value={dateFromMonthlyDay(field.state.value)}
                      valueLabel={formatMonthlyDay(field.state.value)}
                      onChange={(date) => {
                        field.handleChange(monthlyDayFromDate(date));
                      }}
                      error={getFieldError(field.state.meta.errors)}
                      webValue={
                        field.state.value != null
                          ? String(field.state.value)
                          : ""
                      }
                      onWebChangeText={(text) => {
                        const digits = text.replace(/[^0-9]/g, "");
                        if (!digits) {
                          field.handleChange(undefined);
                          return;
                        }
                        const next = Number(digits);
                        field.handleChange(
                          Number.isFinite(next) ? next : undefined,
                        );
                      }}
                      webPlaceholder="1–31"
                      webKeyboardType="number-pad"
                      webMaxLength={2}
                    />
                  )}
                </form.Field>
              </>
            ) : null
          }
        </form.Subscribe>
      </SettingsSection>

      <SettingsSection title="Reminders">
        <form.Field name="reminderEnabled">
          {(field) => (
            <SettingsRow
              title="Remind me"
              icon={AlarmClockIcon}
              iconBackground="#AF52DE"
              trailing={
                <Switch
                  isSelected={field.state.value}
                  onSelectedChange={field.handleChange}
                  accessibilityLabel="Enable reminders"
                />
              }
              onPress={() => field.handleChange(!field.state.value)}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.reminderEnabled}>
          {(reminderEnabled) =>
            reminderEnabled ? (
              <>
                <Separator className="ml-14 mr-4" />
                <form.Field name="reminderTime">
                  {(field) => (
                    <HabitDateTimePickerRow
                      title="Time"
                      description="When to nudge you"
                      required
                      mode="time"
                      value={dateFromReminderTime(field.state.value)}
                      valueLabel={formatReminderTime(field.state.value)}
                      onChange={(date) => {
                        field.handleChange(reminderTimeFromDate(date));
                      }}
                      error={getFieldError(field.state.meta.errors)}
                      webValue={field.state.value ?? ""}
                      onWebChangeText={field.handleChange}
                      webPlaceholder="09:00"
                      webKeyboardType="numbers-and-punctuation"
                      webMaxLength={5}
                    />
                  )}
                </form.Field>
              </>
            ) : null
          }
        </form.Subscribe>
      </SettingsSection>

      <SettingsSection title="Goal" description="Optional">
        <form.Field name="targetCount">
          {(field) => (
            <HabitFormField
              label="Target"
              placeholder="e.g. 10"
              value={field.state.value != null ? String(field.state.value) : ""}
              onChangeText={(text) => {
                const digits = text.replace(/[^0-9]/g, "");
                if (!digits) {
                  field.handleChange(undefined);
                  return;
                }
                const next = Number(digits);
                field.handleChange(Number.isFinite(next) ? next : undefined);
              }}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              keyboardType="number-pad"
              maxLength={4}
            />
          )}
        </form.Field>
        <Separator className="mx-4" />
        <form.Field name="unit">
          {(field) => (
            <HabitFormField
              label="Unit"
              placeholder="pages, minutes, glasses…"
              value={field.state.value ?? ""}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              error={getFieldError(field.state.meta.errors)}
              autoCapitalize="none"
              maxLength={30}
            />
          )}
        </form.Field>
      </SettingsSection>

      <Typography type="body-sm" className="px-1 text-muted">
        Starts today. You can refine details later.
      </Typography>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            variant="primary"
            size="md"
            className="rounded-4xl"
            isDisabled={isSubmitting}
            onPress={() => form.handleSubmit()}
          >
            {isSubmitting ? (
              <Spinner size="sm" color="white" />
            ) : (
              <Button.Label>Save habit</Button.Label>
            )}
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}

export { habitFormSchema };
export type { HabitFormValues };
