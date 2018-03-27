let findLattice = (rows, cols) => {
    let matrix = Array(rows).fill(0).map( x => {
        return Array(cols).fill(0)
    });

    for (let i = 0; i < rows; i++) {
        matrix[i][0] = i + 2;
    }

    for (let j = 0; j < cols; j++) {
        matrix[0][j] = j + 2;
    }

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            matrix[i][j] = matrix[i-1][j] + matrix[i][j-1]
        }
    }

    return matrix[rows-1][cols-1];
}

console.log(findLattice(2,2));
console.log(findLattice(3,3));
console.log(findLattice(4,4));
console.log(findLattice(5,5));
console.log(findLattice(2,3));

