/*
Document Schema:
{
  _id: ###,
  game: (_id of game object),
  order: 1,
  time: ,
  player: thief/detective-1/2/3/4/5,
  station: 192,
  transport: taxi/bus/ug/black,
}
*/

Moves = new Meteor.Collection('moves');
