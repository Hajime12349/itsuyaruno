"use server";

export async function postAction(formData: FormData) {
  const name = formData.get("name");
  console.log(name);
}

