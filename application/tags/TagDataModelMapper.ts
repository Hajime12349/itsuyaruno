import type { TagEntity } from "@/domain/tags/Tag";
import { ITagNotification } from "@/domain/tags/ITagNotification";
import { TagName } from "@/domain/tags/valueObjects/TagName";

export interface ITagDataModel {
  tag_name: string;
}

export class TagDataModelBuilder implements ITagNotification {
  private tagProps: ITagDataModel = {
    tag_name: "",
  };

  Name(name: TagName): void {
    this.tagProps.tag_name = name.value;
  }

  build(): ITagDataModel {
    return this.tagProps;
  }
}
