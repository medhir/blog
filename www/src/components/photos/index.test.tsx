import React from "react";
import Photos from "./index";
import { shallow } from "enzyme";

describe("Photos", () => {
  const photos = [
    {
      name: "photo1",
      url: "https://photo.com/1",
    },
    {
      name: "photo2",
      url: "https://photo.com/2",
    },
    {
      name: "photo3",
      url: "https://photo.com/3",
    },
    {
      name: "photo4",
      url: "https://photo.com/4",
    },
    {
      name: "photo5",
      url: "https://photo.com/5",
    },
  ];
  it("renders photos", () => {
    const wrapper = shallow(<Photos photos={photos} />);
    expect(wrapper.find("img").length).toEqual(5);
  });
});
