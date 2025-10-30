import React from 'react';
import EditButton from './editbutton';

export default function CreateBoatButton() {
  return EditButton({ boat: {}, label: 'Add Boat' });
}
