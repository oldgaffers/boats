import { test, expect } from 'vitest';
import fs from 'fs';
import { getBoatFromYAML } from '../../src/util/yaml_utils';

test('yaml with unicode in html', async () => {
    const yaml = fs.readFileSync('tests/mock/1210.yml', 'utf8');
    const boat = await getBoatFromYAML(yaml);
    expect(boat).toMatchSnapshot();
});
