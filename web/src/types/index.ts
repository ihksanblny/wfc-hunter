export type Review = {
    user: string;
    text: string;
    rating: string | number;
    date: string;
};

export type Cafe = {
    shop_id: string;
    shop_name: string;
    nugas_score: number;
    kerja_score: number;
    nongkrong_score: number;
    rating_avg: number;
    summary: string;
    best_for: string[];
    latitude: string;
    longitude: string;
    reviews_list?: Review[];
};
