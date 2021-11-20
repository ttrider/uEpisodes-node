import fs from "fs";
import { parse } from "../src/modules/name-parser";
import { EpGuidesMetadataProvider } from "../src/modules/epguides-provider";

jest.setTimeout(60000);

describe("simple", () => {
  it("name parsers", async () => {
    const testSets = JSON.parse(
      fs.readFileSync("test/test-sets.json").toString()
    );

    for (const fileline of testSets.files) {
      if (fileline.title) {
        if (Array.isArray(fileline.title)) {
          fileline.title = fileline.title.map((t: string) => t.toLowerCase());
        } else {
          fileline.title = fileline.title.toLowerCase();
        }
      }
    }
    fs.writeFileSync("test/test-sets.json", JSON.stringify(testSets, null, 2));

    for (const fileline of testSets.files) {
      const results = parse(fileline.path.split("/"));

      if (results.showName) {
        if (Array.isArray(results.showName)) {
          results.showName = results.showName.map((t: string) =>
            t.toLowerCase()
          );
        } else {
          results.showName = results.showName.toLowerCase();
        }
      }

      expect({
        ...results,
        path: fileline.path,
        name: fileline.name,
      }).toStrictEqual(fileline);
    }
  });
});

describe.skip("epguides integration", () => {
  it.skip("end-to-end-shows", async () => {
    const provider = new EpGuidesMetadataProvider();

    const metadata = await provider.getShows();

    expect(metadata).toBeTruthy();
  });

  it.skip("end-to-end-episodes", async () => {
    const provider = new EpGuidesMetadataProvider();

    const metadata = await provider.getShowById("1");

    expect(metadata).toBeTruthy();
  });
});


