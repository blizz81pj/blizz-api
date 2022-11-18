create table beer_net.beer_yeast
(
    beer_yeast_id  int unsigned auto_increment
        primary key,
    name           varchar(50)                        not null,
    is_kettle_sour tinyint(1)                         null,
    row_created    datetime default CURRENT_TIMESTAMP null,
    row_modified   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);