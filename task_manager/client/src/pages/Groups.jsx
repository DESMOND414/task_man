import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import {
  useCreateGroupMutation,
  useGetGroupsQuery,
} from "../redux/slices/api/groupApiSlice";
import { Button, Loading, Textbox, Table } from "../components";

const columns = ["Name", "Description", "Owner", "Members"];

const Groups = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const { data: groups, isLoading } = useGetGroupsQuery();
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup({ name: groupName, description: groupDescription }).unwrap();
      toast.success("Group created successfully!");
      setGroupName("");
      setGroupDescription("");
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create group.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          label="Add New"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <Table columns={columns}>
            {groups?.map((group) => (
              <tr
                key={group._id}
                className="hover:bg-gray-100 cursor-pointer"
                //   onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <td className="py-2 px-4 border-b">{group.name}</td>
                <td className="py-2 px-4 border-b">{group.description}</td>
                <td className="py-2 px-4 border-b">{group.owner?.name}</td>
                <td className="py-2 px-4 border-b">
                  {group.members?.map((member) => member.name).join(", ")}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setGroupName("");
          setGroupDescription("");
        }}
      >
        <Dialog.Panel className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <form
            onSubmit={handleCreateGroup}
            className="bg-white p-6 rounded-lg w-full max-w-md"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Create New Group
            </Dialog.Title>
            <div className="mb-4">
              <Textbox
                label="Group Name"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <Textbox
                label="Description"
                type="text"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                className="bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
              <Button
                type="submit"
                className="bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                label="Create"
                disabled={isCreating}
              />
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default Groups;