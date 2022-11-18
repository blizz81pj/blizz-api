create table beer_net.beer_hop
(
    beer_hop_id  int unsigned auto_increment
        primary key,
    name         varchar(50)                        not null,
    alpha_acid   decimal(10, 2)                     null,
    row_created  datetime default CURRENT_TIMESTAMP null,
    row_modified datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);