﻿'use strict';

var CompoundUnit = require('./compound-units'),
    UnitTypes = require('./unit-types');



/**
 * public constructor Scalar(numeric value, Unit unit)
 *
 * create a new instance of a scalar measurement.
 *
 * @constructor
 */
var Scalar = function(value, unit) {
    this.value = value;
    this.unit = unit;
};



/**
 * private CompoundUnit convertCompoundUnit(
 *      CompoundUnit compoundUnit,
 *      Unit unit,
 *      int index
 *
 * converts one of the units, default to first unit, in a
 * compound unit to another. Similar to converting a regular Unit
 */
function convertCompoundUnit(compoundUnit, unit, index) {
    // Default to the root unit.
    if (index == undefined)
        index = 0;

    // Get array of sub units from current unit
    var subUnits = compoundUnit.subUnits.slice(0);

    // Check if the unit at the given index matches type
    // with the new unit
    if ((unit.type != subUnits[index].type))
        throw new Error('Invalid Units: a unit of type `' + 
                        subUnits[index].type + 
                        '` cannot be converted to a unit of type `' + 
                        unit.type + '`');

    // adjust the copy of the subunits array to create
    // a new compound unit based off of the original
    subUnits[index] = unit;
    return new CompoundUnit(subUnits);
}



/**
 * public numeric getValue(Unit unit, int index)
 *
 * Returns a numeric value representative of the scalar value,
 * optionally a value of the scalar based on a seperate unit.
 *
 * 25km -> 25
 */
Scalar.prototype.getValue = function(unit, index) {
    if (typeof unit === 'string')
        unit = this.units[unit];

    if (unit !== undefined && this.unit.type === UnitTypes.COMPOUND) {
        unit = convertCompoundUnit(this.unit, unit, index);
    }

    if (unit === undefined)
        unit = this.unit;

    return this.value * (this.unit.getMultiplier() / unit.getMultiplier());
};



/**
 * public Unit as(Unit unit, int index)
 *
 * Returns an equivalent scalar with a new unit
 */
Scalar.prototype.as = function(unit, index) {
    if (typeof unit === 'string')
        unit = this.units[unit];

    var newValue = this.getValue(unit, index);

    // Change directly one of the units inside a compound unit
    if (this.unit.type == UnitTypes.COMPOUND) {
        unit = convertCompoundUnit(this.unit, unit, index);
    }

    if ((unit.type != this.unit.type))
        throw new Error('Invalid Units: a unit of type `' + this.unit +
                        '` cannot be converted to a unit of type `' +
                        unit + '`');

    return new Scalar(newValue, unit);
};



/**
 * public this<Unit> to(Unit unit, int index)
 *
 * Converts a scalar to another unit of measure
 */
Scalar.prototype.to = function(unit, index) {
    if (typeof unit === 'string')
        unit = this.units[unit];

    var convertedScalar = this.as(unit, index);

    this.value = convertedScalar.value;
    this.unit = convertedScalar.unit;

    return this;
};



/**
 * public this<Unit> as(Unit unit)
 *
 * Makes a compund unit representing the current unit
 * per the given unit.
 *
 * km.per(hr) -> km/hr
 */
Scalar.prototype.per = function(unit) {
    if (typeof unit === 'string')
        unit = this.units[unit];

    if (this.unit.type != UnitTypes.COMPOUND) {
        var compoundUnit = new CompoundUnit();
        compoundUnit.addUnit(this.unit);
        this.unit = compoundUnit;
    }

    this.unit.addUnit(unit);

    return this;
};



/**
 * public string toString()
 *
 * Does what you think it would do,
 * ex) '2km'
 * ex) '2km/hr'
 */
Scalar.prototype.toString = function() {
    return this.value + this.unit;
};



module.exports = Scalar;
