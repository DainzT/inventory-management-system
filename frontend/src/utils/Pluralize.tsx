export const pluralize = (unit: string, quantity: number): string => {
    if (quantity === 1) {
        const lowerUnit = unit.toLowerCase();
        if (lowerUnit.endsWith('s')) {
            if (unit === unit.toUpperCase()) {
                return unit.slice(0, -1);
            } else {
                return unit.slice(0, -1);
            }
        }
        return unit;
    }

    const irregularPlurals: Record<string, string> = {
        box: 'boxes',
        child: 'children',
        foot: 'feet',
        tooth: 'teeth',
        mouse: 'mice',
        person: 'people',
        ox: 'oxen',
        goose: 'geese'
    };

    const lowerUnit = unit.toLowerCase();

    if (irregularPlurals[lowerUnit]) {
        if (unit === unit.toUpperCase()) {
            return irregularPlurals[lowerUnit].toUpperCase();
        } else if (unit[0] === unit[0].toUpperCase()) {
            return irregularPlurals[lowerUnit].charAt(0).toUpperCase() +
                irregularPlurals[lowerUnit].slice(1);
        } else {
            return irregularPlurals[lowerUnit];
        }
    }

    if (lowerUnit.endsWith('s')) {
        return unit; 
    }

    if (unit === unit.toUpperCase()) {
        return unit + 'S';
    } else if (unit[0] === unit[0].toUpperCase()) {
        return unit + 's'; 
    } else {
        return unit + 's'; 
    }
};