package com.example.orders.service;

import com.example.orders.dto.OrderDto;
import com.example.orders.dto.OrderMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvExportService {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public CsvExportService(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    public String exportOrdersToCsv() {
        List<OrderDto> orders = orderService.getAllOrders(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        StringWriter sw = new StringWriter();
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader("id", "customer_name", "customer_email", "item_description", "quantity", "unit_price_cents", "status", "created_at", "updated_at", "notes")
                .build();

        try (final CSVPrinter printer = new CSVPrinter(sw, csvFormat)) {
            for (OrderDto order : orders) {
                printer.printRecord(
                        order.id(),
                        order.customerName(),
                        order.customerEmail(),
                        order.itemDescription(),
                        order.quantity(),
                        order.unitPriceCents(),
                        order.status(),
                        order.createdAt(),
                        order.updatedAt(),
                        order.notes()
                );
            }
        } catch (IOException e) {
            // IOException is not expected with StringWriter
            throw new RuntimeException("Failed to generate CSV file", e);
        }
        return sw.toString();
    }
}
