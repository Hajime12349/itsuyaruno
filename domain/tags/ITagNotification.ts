import { TagName } from "./valueObjects/TagName";

export interface ITagNotification {
  Name(name: TagName): void;
}
