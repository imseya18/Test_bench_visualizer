import React from "react";
import { Input, Form, Button } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";

const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  invoke("set_api_key", { token: data.Token });
};

const getApi = async () => {
  const Api = await invoke("get_api_key");
  console.log(Api);
};

export function Settings() {
  return (
    <div>
      <Form className="w-full max-w-xs" onSubmit={onSubmit}>
        <Input
          className="max-w-xs"
          name="Token"
          label="Token"
          placeholder="Enter Gitlab Token"
          type={"password"}
          variant="bordered"
        />
        <Button color="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Button color="primary" onPress={getApi}>
        Get
      </Button>
    </div>
  );
}
