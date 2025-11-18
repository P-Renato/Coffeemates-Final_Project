export function star(rating: number) {
    let star: string;
    if (rating < 4.5 && rating > 4) star = "⭐⭐⭐⭐";
    else if(rating < 3.5 && rating > 3) star ="⭐⭐⭐";
    else if(rating < 2.5 && rating > 2) star ="⭐⭐";
    else if(rating < 1.5 && rating > 1) star ="⭐";
    else star = "⭐⭐⭐⭐⭐";
    return star;
}