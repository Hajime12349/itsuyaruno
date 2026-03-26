import { BadRequestError } from "@/lib/errors/AppError";
import { ITagNotification } from "./ITagNotification";
import { TagName } from "./valueObjects/TagName";

export interface TagValueProps {
  name: TagName;
}

export class TagEntity {
  readonly name: TagName;

  private constructor(props: TagValueProps) {
    this.name = props.name;
  }

  static create(props: TagValueProps): TagEntity {
    if (!(props.name instanceof TagName)) {
      throw new BadRequestError("TagEntity name must be a TagName");
    }
    return new TagEntity({ name: props.name });
  }

  notify(notification: ITagNotification): void {
    notification.Name(this.name);
  }
}
