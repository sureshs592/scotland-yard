/*
Document Schema:
{
  game: (_id of game object),
  player: thief/detective-1/2/3/4/5,
  station: 192,
  transport: taxi/bus/underground/black,
}
*/

Moves = new Meteor.Collection('moves');
