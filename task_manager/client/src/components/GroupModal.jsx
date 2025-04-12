import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateGroupMutation } from "../redux/slices/api/groupApiSlice";
import { Button, Loading, Textbox } from "./";

const GroupModal = ({ open, setOpen }) => {
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await createGroup(data).unwrap();
      toast.success("Group Created");
      reset();
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!!!");
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title
                    as='h2'
                    className='text-base font-semibold leading-6 text-gray-900'
                  >
                    Add New Group
                  </Dialog.Title>
                  <div className='mt-2 space-y-4'>
                    <Textbox
                      type='text'
                      label='Group Name'
                      placeholder='Enter group name'
                      name='name'
                      className='w-full'
                      register={register("name", {
                        required: "Group name is required!",
                      })}
                      error={errors.name ? errors.name.message : ""}
                    />
                    <Textbox
                      type='text'
                      label='Description'
                      placeholder='Enter group Description'
                      name='description'
                      className='w-full'
                      register={register("description", {
                        required: "Group description is required!",
                      })}
                      error={errors.description ? errors.description.message : ""}
                    />
                  </div>
                  <div className='mt-4 flex gap-4'>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <Button
                        type='submit'
                        label='Create'
                        className='bg-blue-500 px-5 text-sm font-semibold text-white sm:w-auto'
                      />
                    )}

                    <Button
                      type='button'
                      className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                      onClick={() => setOpen(false)}
                      label='Cancel'
                    />
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default GroupModal;