import fs from 'fs';
import { buildChanges, includes, elements_matching_by_field, nameChanges, recursiveUpdate, salesChanges, updateOwnerships, updateOwnership, boatdiff } from '../components/editboatwizard';
import { channel } from 'diagnostics_channel';

const robinetta = JSON.parse(fs.readFileSync('src/test/robinetta.json'));
const pickers = {
  design_class: [{ "id": "c05a2174-4b46-410f-829f-894193f020c3", "name": "Falmouth Bass Boat" }],
  designer: [],
  builder: [],
};

test('diff no change', () => {
  const delta = boatdiff(robinetta, robinetta);
  expect(delta).toMatchSnapshot();
});

test('diff name change', () => {
  const after = JSON.parse(JSON.stringify(robinetta));
  after.name = 'Cloud';
  after.previous_names = ['Victoria'];
  const delta = boatdiff(robinetta, after);
  expect(delta).toMatchSnapshot();
});