import fs from "fs";
import { parse } from "../src/modules/name-parser";


jest.setTimeout(6000000);

describe.skip("simple", () => {
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

      expect({
        ...results,
        path: fileline.path,
        name: fileline.name,
      }).toStrictEqual(fileline);
    }
  });
});

// describe.skip("epguides integration", () => {
//   it.skip("end-to-end-shows", async () => {
//     const provider = new EpGuidesMetadataProvider();

//     const metadata = await provider.getShows();

//     expect(metadata).toBeTruthy();
//   });

//   it.skip("end-to-end-episodes", async () => {
//     const provider = new EpGuidesMetadataProvider();

//     const metadata = await provider.getShowById("1");

//     expect(metadata).toBeTruthy();
//   });

//   it.skip("visual validation", async () => {
//     const provider = new EpGuidesMetadataProvider();

//     const exactMatch = [];
//     const noMatch = [];
//     const partialMatch = [];

//     const testSets = JSON.parse(
//       fs.readFileSync("test/test-sets.json").toString()
//     );

//     const total = testSets.files.length;
//     let index = 0;
//     for (const fileline of testSets.files) {
//       console.info(index);
//       try {
//         const results = parse(fileline.path.split("/"));

//         const candidates = await provider.detectEpisode(results);

//         if (candidates.length > 0) {
//           if (candidates[0].rank === 100) {
//             fileline.candidates = [candidates[0]];
//             exactMatch.push(fileline);
//             console.info(total, index, fileline.path, "exact match");
//           } else {
//             fileline.candidates = candidates;
//             partialMatch.push(fileline);
//             console.info(total, index, fileline.path, "partial macth");
//           }
//         } else {
//           noMatch.push(fileline);
//           console.info(total, index, fileline.path, "no match");
//         }
//       } catch (e) {
//         console.error(total, index, fileline.path, e.message);
//       }
//       index++;
//     }

//     fs.writeFileSync(
//       "test/exact-match.json",
//       JSON.stringify(exactMatch, null, 2)
//     );
//     fs.writeFileSync("test/no-match.json", JSON.stringify(noMatch, null, 2));
//     fs.writeFileSync(
//       "test/partial-match.json",
//       JSON.stringify(partialMatch, null, 2)
//     );

//     expect(1).toBeTruthy();
//   });
// });
