export interface User {
    id?: string;
    picture?: string;
    pictureThumbnail?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    nickname?: string;
    fullname?: string;
    headline?: string;
    tags?: string[];
    bio?: string;
    linkedin?: string;
    city?: string;
    category?: string;
    roles?: {
        admin?: boolean,
        approver?: boolean,
        user?: boolean
    };
    status?: 'published' | 'approved' | 'rejected';
    createdAt?: any;
    modifiedAt?: any;
}


