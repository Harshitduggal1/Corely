'use client'

import React from 'react'

import { Button } from '@/_components/ui/button'

import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'

import { ErrorMessage } from '@hookform/error-message'
import { Loader } from '@/_components/loader'
import FormGenerator from '../forms/form-generator'
import { UploadIcon } from 'lucide-react'
import { useProducts } from '@/hooks/settings/use-settings'

type CreateProductFormProps = {
  id: string
}

export const CreateProductForm = ({ id }: CreateProductFormProps) => {
  const { onCreateNewProduct, register, errors, loading } = useProducts(id)
  return (
    <form
      className="flex flex-col gap-5 mt-3 py-10 w-full"
      onSubmit={onCreateNewProduct}
    >
      <FormGenerator
        inputType="input"
        register={register}
        label="Name"
        name="name"
        errors={errors}
        placeholder="Your product name"
        type="text"
      />
      <div className="flex flex-col items-start">
        <Label
          htmlFor="upload-product"
          className="flex items-center gap-2 bg-peach p-3 rounded-lg font-semibold text-gray-600 text-sm cursor-pointer"
        >
          <Input
            {...register('image')}
            className="hidden"
            type="file"
            id="upload-product"
          />
          <UploadIcon />
          Upload
        </Label>
        <ErrorMessage
          errors={errors}
          name="image"
          render={({ message }) => (
            <p className="mt-2 text-red-400">
              {message === 'Required' ? '' : message}
            </p>
          )}
        />
      </div>
      <FormGenerator
        inputType="input"
        register={register}
        label="Price"
        name="price"
        errors={errors}
        placeholder="0.00"
        type="text"
      />
      <Button
        type="submit"
        className="w-full"
      >
        <Loader loading={loading}>Create Product</Loader>
      </Button>
    </form>
  )
}
