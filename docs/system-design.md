# System design

## Level 1

- Abstraction
- Encapsulation
- Inheritance vs. Aggregation
- Polymorphism
- Types vs. Classes
- Abstraction Qualities (cohesion, coupling, etc)

## Level 2

- SOLID principles
- Modularity
- Separation of concerns principle
- Architectural Patterns:
  - MV\* (MVC, MVP, MVVM, MVI)
  - Layered Architecture (3-tier):
    - Pattern Description
    - Key Concepts
    - Trade-offs
  - Microservice architecture:
    - What Are Microservices?
    - Key Benefits
    - Trade-offs
- IoC (Inversion of Control)
- GoF: types of patterns:
  - creational:
    - Factory
    - Factory method
    - Singleton
    - Abstract factory
    - Prototype
    - Builder
  - behavioral:
    - Observer
    - Strategy
    - Template method
    - Iterator
  - structural:
    - Facade
    - Decorator
    - Adapter
    - Proxy
- Levels of system requirements (understanding of requirements types):
  - business requirements
  - user requirements
  - functional and non-functional requirements

## Level 3

- Architectural Patterns:
  - SBA (Service Based Architecture):
    - SBA Concepts
    - SBA vs Microservices
  - SOA (Service Oriented Architecture):
    - Definitions of SOA
    - SOA Concepts
    - Service Attributes
- GoF: pros and cons, practical usage:
  - Observer vs Mediator vs PubSub
  - behavioral
    - Chain of Responsibility
    - Command
    - Interpreter
    - Memento
    - State
    - Visitor
  - structural
    - Bridge
    - Flyweight

## Level 4

- Architectural Patterns:
  - Event-Driven Architecture:
    - Pattern Description
    - Broker Topology
    - Mediator Topology
    - Trade-offs
    - CQRS
    - Event Sourcing
  - Microservice architecture
    - How to Model Services
    - Integration
    - Splitting the Monolith
    - Deployment
    - Testing
    - Monitoring
    - Security
  - SOA (service-oriented architecture):
    - Message exchange patterns
    - Service lifecycle
    - Versioning
    - Performance
    - Security

## Level 5

- System requirements:
  - define key non-functional system requirements among of:
    - Maintainability
    - Responsibility
    - Readability
    - Testability
    - Scalability
    - Performance
    - Availability
    - Usability
  - design a system to ensure compliance with key non-functional attributes
- CAP Theorem
  - Consistency
  - Availability
  - Partition tolerance
- Load Balancing
  - Benefits of Load Balancing
  - Load Balancing Algorithms
  - Redundant Load Balancers
  - Hardware/Software Load Balancers
- Caching
  - Application server cache
  - Distributed cache
  - Global Cache
  - Cache Invalidation
  - Cache eviction policies

## References

- [EN] [Design Patterns](https://www.oodesign.com)
- [EN] [A free book on design patterns in JS with animations & examples on CodeSandbox](https://www.patterns.dev/)
- [EN] [Functional Vs. Non Functional Requirements](https://www.guru99.com/functional-vs-non-functional-requirements.html)
- [EN] [ISO/IEC 25010 - Product Quality Standard](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
- [EN] [Understanding Quality Attributes](https://www.cs.unb.ca/~wdu/cs6075w10/sa2.htm)
- [EN] [Grokking the System Design](https://lms.eleks.com/course/view.php?id=46)
- [EN] [Microservice Architecture](https://microservices.io/index.html)
- [EN] [Building Microservices](https://www.safaribooksonline.com/library/view/building-microservices/9781491950340/)
- [EN] [Architecting Cloud Computing Solutions](https://www.safaribooksonline.com/library/view/architecting-cloud-computing/9781788472425)
- [EN] [Clean architecture](https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/)
- [EN] [CQRS patter](https://martinfowler.com/bliki/CQRS.html)
- [EN] [Event Sourcing](https://microservices.io/patterns/data/event-sourcing.html)
- [EN] [Unidirectional User Interface Architectures](https://staltz.com/unidirectional-user-interface-architectures.html)
