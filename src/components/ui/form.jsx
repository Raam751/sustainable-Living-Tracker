
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = (
  { ...props }
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItemContext = React.createContext({})

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <FormItemContext.Provider value={{ id: props.id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const formItemContext = React.useContext(FormItemContext)
  const { error, formItemId } = formItemContext

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const formItemContext = React.useContext(FormItemContext)
  const { error, formItemId, formDescriptionId, formMessageId } = formItemContext

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const formItemContext = React.useContext(FormItemContext)
  const { formDescriptionId } = formItemContext

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const formItemContext = React.useContext(FormItemContext)
  const { error, formMessageId } = formItemContext
  const formContext = useFormContext()
  const fieldState = formContext?.getFieldState(formItemContext?.name, formContext)
  const message = error || fieldState?.error?.message || null

  if (!message) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const formItemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  const formItemId = `${fieldContext.name}-form-item`
  const formDescriptionId = `${fieldContext.name}-form-item-description`
  const formMessageId = `${fieldContext.name}-form-item-message`

  formItemContext.error = fieldState.error
  formItemContext.formItemId = formItemId
  formItemContext.formDescriptionId = formDescriptionId
  formItemContext.formMessageId = formMessageId

  return {
    id: formItemId,
    name: fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
    ...fieldState,
  }
}
